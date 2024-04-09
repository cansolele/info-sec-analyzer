FROM python:latest

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN apt-get update && apt-get install -y libxml-xpath-perl pdfgrep

EXPOSE 5000

CMD ["python3", "server.py"]