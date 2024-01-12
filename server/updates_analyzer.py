from flask import Blueprint, request, send_file, jsonify
from flask_socketio import emit
import xml.etree.ElementTree as ET
from dateutil import parser
from datetime import datetime
from cpe_mapping import cpe_mapping
import json
import os

updates_analyzer_routes = Blueprint("updates_analyzer", __name__)

# Create necessary directories if they don't exist
updates_analyzer_directory = os.path.join(
    os.path.dirname(__file__), "Updates-analyzer"
)
uploads_directory = os.path.join(updates_analyzer_directory, "uploads")
output_directory = os.path.join(updates_analyzer_directory, "output")
info_directory = os.path.join(updates_analyzer_directory, "info")

os.makedirs(updates_analyzer_directory, exist_ok=True)
os.makedirs(uploads_directory, exist_ok=True)
os.makedirs(output_directory, exist_ok=True)
os.makedirs(info_directory, exist_ok=True)




@updates_analyzer_routes.route("/make-updates-analysis", methods=["POST"])
def make_updates_analysis():
    # Check if a file is uploaded
    if "file" not in request.files:
        return "No file uploaded", 400

    file = request.files["file"]
    if file.filename == "":
        return "No file selected", 400
    # Check the file extension to handle both XML and PDF
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in [".xml"]:
        return "Invalid file format. Only XML files are allowed.", 400

    # Save the uploaded file
    current_datetime = datetime.now().strftime("%d%m%y_%H%M%S")
    filename = f"Updates_{current_datetime}"
    file_path = os.path.join(uploads_directory, filename + file_extension)
    file.save(file_path)

    updates_json = os.path.join(
        output_directory, f"Updates_{current_datetime}.json"
    )
    tree = ET.parse(file_path)
    root = tree.getroot()

    # Extract report name
    report_name = root.find(".//metadata/options/name")
    if report_name is not None:
        report_name = report_name.text
    else:
        report_name = "Unnamed Report"

    updates_data = {}
    product_updates_data = {}

    for target_report in root.findall(".//job_report/target_report"):
        target_id = target_report.find("target").text
        target_address = root.find(
            f".//targets/target[@inner_id='{target_id}']/address"
        ).text
        target_updates = target_report.findall(".//patch")

        critical_count = 0
        high_count = 0
        medium_count = 0
        low_count = 0
        unavailable_count = 0

        # Extract CPE information from result element
        cpe = target_report.find("result").get("cpe")
        if cpe in cpe_mapping:
            cpe = cpe_mapping[cpe]

        for update in target_updates:
            inner_id = update.get("inner_id")
            definition = root.find(f".//definition[@inner_id='{inner_id}']")
            severity = definition.get("severity")

            if severity == "Critical":
                critical_count += 1
            elif severity == "High":
                high_count += 1
            elif severity == "Medium":
                medium_count += 1
            elif severity == "Low":
                low_count += 1
            elif severity == "NotAvailable":
                unavailable_count += 1

            products = update.findall(".//products/product")
            for product in products:
                product_cpe = product.text
                readable_cpe = cpe_mapping.get(product_cpe, product_cpe)

                if readable_cpe not in product_updates_data:
                    product_updates_data[readable_cpe] = {
                        "Critical": 0,
                        "High": 0,
                        "Medium": 0,
                        "Low": 0,
                        "Unavailable": 0,
                    }

                if severity == "Critical":
                    product_updates_data[readable_cpe]["Critical"] += 1
                elif severity == "High":
                    product_updates_data[readable_cpe]["High"] += 1
                elif severity == "Medium":
                    product_updates_data[readable_cpe]["Medium"] += 1
                elif severity == "Low":
                    product_updates_data[readable_cpe]["Low"] += 1
                elif severity == "NotAvailable":
                    product_updates_data[readable_cpe]["Unavailable"] += 1

        updates_data[target_address] = {
            "Critical": critical_count,
            "High": high_count,
            "Medium": medium_count,
            "Low": low_count,
            "Unavailable": unavailable_count,
            "Total": critical_count
            + high_count
            + medium_count
            + low_count
            + unavailable_count,
            "CPE": cpe,  # Include CPE information
        }

    # Extract the desired information from the XML
    formatted_creation_time = parser.parse(root.attrib.get("creation_time")).strftime(
        "%d.%m.%Y %H:%M:%S"
    )

    earliest_start_time = None
    latest_stop_time = None

    for target_report in root.findall(".//body/job_report/target_report"):
        for result in target_report.findall(".//result"):
            start_time_str = result.get("start")
            stop_time_str = result.get("stop")

            start_time = parser.parse(start_time_str)
            stop_time = parser.parse(stop_time_str)

            if earliest_start_time is None or start_time < earliest_start_time:
                earliest_start_time = start_time

            if latest_stop_time is None or stop_time > latest_stop_time:
                latest_stop_time = stop_time

    target_hosts = root.find(".//metadata/options/targets").text

    total_updates = 0

    for target_data in updates_data.values():
        total_updates += target_data["Total"]

    percent_data = {
        "Critical": 0.00,
        "High": 0.00,
        "Medium": 0.00,
        "Low": 0.00,
        "Unavailable": 0.00,
    }

    for target_data in updates_data.values():
        if total_updates > 0:
            percent_data["Critical"] += round(
                (target_data["Critical"] / total_updates) * 100, 2
            )
            percent_data["High"] += round(
                (target_data["High"] / total_updates) * 100, 2
            )
            percent_data["Medium"] += round(
                (target_data["Medium"] / total_updates) * 100, 2
            )
            percent_data["Low"] += round(
                (target_data["Low"] / total_updates) * 100, 2
            )
            percent_data["Unavailable"] += round(
                (target_data["Unavailable"] / total_updates) * 100, 2
            )

    # Convert the percentages to strings with fixed decimal places
    percent_data = {k: "{:.2f}".format(v) for k, v in percent_data.items()}

    result = {
        "creation_time": formatted_creation_time,
        "start_time": earliest_start_time.strftime("%d.%m.%Y %H:%M:%S"),
        "end_time": latest_stop_time.strftime("%d.%m.%Y %H:%M:%S"),
        "target_hosts": target_hosts.replace(";", "; "),
        "percent": percent_data,  # Include percentage information
        "updates": updates_data,
        "products": product_updates_data,
    }

    with open(updates_json, "w") as updates_file:
        json.dump(result, updates_file, indent=4)
    update_report_history(updates_json, current_datetime, report_name)
    return jsonify(result)


def update_report_history(output_file, current_datetime, report_name):
    report_history_file = os.path.join(info_directory, "ReportHistory.json")

    # Load existing report history or create an empty list
    if os.path.exists(report_history_file):
        with open(report_history_file, "r") as json_file:
            report_history = json.load(json_file)
    else:
        report_history = []

    # Add the new report file to the history
    datetime_obj = datetime.strptime(current_datetime, "%d%m%y_%H%M%S")
    formatted_time = datetime_obj.strftime("%d.%m.%Y %H:%M:%S")
    report_info = {
        "filename": os.path.basename(output_file),
        "time": formatted_time,
        "report_name": report_name,  # Include the report name
    }
    report_history.append(report_info)

    # Save the updated report history
    with open(report_history_file, "w") as json_file:
        json.dump(report_history, json_file)

    emit(
        "reportHistoryUpdated",
        {"message": "Report history updated"},
        namespace="/",
        broadcast=True,
    )


@updates_analyzer_routes.route("/report-history", methods=["GET"])
def report_history():
    report_history_file = os.path.join(info_directory, "ReportHistory.json")

    if not os.path.exists(report_history_file):
        return jsonify([])

    with open(report_history_file, "r") as json_file:
        report_history = json.load(json_file)

    return jsonify(report_history)


@updates_analyzer_routes.route("/get-report/<filename>", methods=["GET"])
def get_report(filename):
    report_file_path = os.path.join(output_directory, filename)
    if os.path.exists(report_file_path):
        with open(report_file_path, "r") as file:
            report_data = json.load(file)
        return jsonify(report_data)
    else:
        return jsonify({"error": "Report not found"}), 404
