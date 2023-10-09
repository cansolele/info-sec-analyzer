from flask import Flask, request, Response, send_file, jsonify
import os
import json
from flask_cors import CORS as flask_cors
from tool_descriptions import tool_descriptions
import subprocess
from exploits_table import exploits_table_routes

# Create necessary directories if they don't exist
os.makedirs(os.path.join(os.path.dirname(__file__), "uploads"), exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(__file__), "info"), exist_ok=True)
os.makedirs(
    os.path.join(os.path.dirname(__file__), "output", "exploits_table"), exist_ok=True
)

app = Flask("cis-server")
flask_cors(app)


# Register the exploits_table_routes Blueprint
app.register_blueprint(exploits_table_routes)


# Route to handle file downloads
@app.route("/download/<timestamp>", methods=["GET"])
def download_file(timestamp):
    output_dir = os.path.join(os.path.dirname(__file__), "output", "exploits_table")
    output_file = os.path.join(output_dir, f"Exploits_{timestamp}.xlsx")

    if not os.path.exists(output_file):
        return "File not found", 404

    return send_file(output_file, as_attachment=True)


@app.route("/file-history", methods=["GET"])
def file_history():
    report_history_file = os.path.join(
        os.path.dirname(__file__), "info", "ReportHistory.json"
    )

    if not os.path.exists(report_history_file):
        return jsonify([])

    with open(report_history_file, "r") as json_file:
        report_history = json.load(json_file)

    return jsonify(report_history)


# Route to provide tool descriptions
@app.route("/about", methods=["POST"])
def about():
    data = request.get_json()
    tool = data["tool"]
    description = tool_descriptions[tool]
    return Response(description, mimetype="text/plain")


if __name__ == "__main__":
    app.run(host="0.0.0.0")
