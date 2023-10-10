from flask import Flask, request, Response
from flask_cors import CORS as flask_cors
from tool_descriptions import tool_descriptions
from exploits_table import exploits_table_routes

app = Flask("cis-server")
flask_cors(app)

app.register_blueprint(exploits_table_routes)


@app.route("/about", methods=["POST"])
def about():
    data = request.get_json()
    tool = data["tool"]
    description = tool_descriptions[tool]
    return Response(description, mimetype="text/plain")


if __name__ == "__main__":
    app.run(host="0.0.0.0")
