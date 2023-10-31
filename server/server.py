from flask import Flask, request, jsonify
from flask_cors import CORS
from tool_descriptions import tool_descriptions
from exploits_table import exploits_table_routes
from vulnerability_analyzer import vulnerability_analyzer_routes
from flask_socketio import SocketIO

app = Flask("cis-server")

socketio = SocketIO(app, cors_allowed_origins="*")

CORS(app, resources={r"/*": {"origins": "*"}})


app.register_blueprint(exploits_table_routes)
app.register_blueprint(vulnerability_analyzer_routes)


@app.route("/about", methods=["POST"])
def about():
    data = request.json
    tool = data["tool"]
    description = tool_descriptions[tool]
    return jsonify(description), 200


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
