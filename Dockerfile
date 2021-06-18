FROM python:3.7.3
WORKDIR /var/server
COPY ./requirements.txt /var/server/requirements.txt
RUN pip install -r requirements.txt
COPY ./ /var/server/

CMD ["python", "Server.py"]

