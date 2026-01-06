from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route("/scrape/car-image", methods=["GET"])
def scrape_car_image():
    make = request.args.get("make")
    model = request.args.get("model")
    year = request.args.get("year")

    if not all([make, model, year]):
        return jsonify({"error": "Missing parameters"}), 400

    try:
        query = f"{make} {model} {year}".replace(" ", "+")
        url = f"https://www.caranddriver.com/search/?q={query}"

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        img = soup.find("img", {'class': 'css-yav68z e1vss6cz3'})

        if not img or not img.get("src"):
            return jsonify({"img": None})

        return jsonify({"img": img["src"]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
