FROM python

# Install libsaxon
RUN wget "https://www.saxonica.com/download/libsaxon-HEC-setup64-v11.4.zip" -P "/opt/" && \
    unzip "/opt/libsaxon-HEC-setup64-v11.4.zip" -d "/opt/" && \
    cp "/opt/libsaxon-HEC-11.4/libsaxonhec.so" /usr/lib/. && \
    cp -r "/opt/libsaxon-HEC-11.4/rt" /usr/lib/. && \
    cp -r "/opt/libsaxon-HEC-11.4/saxon-data" /usr/lib/.

# Create Python extension
WORKDIR /opt/libsaxon-HEC-11.4/Saxon.C.API/python-saxon
RUN pip3 install cython && \
    python3 saxon-setup.py build_ext -if

# Test Python with Saxon
COPY ./test.py /app/
COPY ./ah-juso.cmdi /app/
CMD ["python3", "/app/test.py"]
