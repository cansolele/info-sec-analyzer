FROM python:latest

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN apt-get update && apt-get install -y libxml-xpath-perl pdfgrep

RUN git clone https://gitlab.com/exploit-database/exploitdb.git /opt/exploitdb
RUN ln -sf /opt/exploitdb/searchsploit /usr/local/bin/searchsploit
RUN searchsploit -u

EXPOSE 5000

CMD ["python3", "server.py"]