# ==========================================================
# BASE IMAGE
# ==========================================================
FROM node:22-bookworm-slim


# ==========================================================
# INSTALL SYSTEM DEPENDENCIES
# ==========================================================
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# ==========================================================
# WORKING DIRECTORY
# ==========================================================
WORKDIR /app


# ==========================================================
# TEMPLATE PROJECT (MVC)
# ==========================================================
# Isi folder template/ disalin ke /app (src/) oleh entrypoint.sh
# pada start pertama, jika src/package.json belum ada.
# Mengubah template/ butuh build ulang image (--build).
COPY template /opt/template


# ==========================================================
# ENTRYPOINT
# ==========================================================
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# sed: buang CRLF (file dari Windows) supaya script bisa jalan di Linux
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh


# ==========================================================
# START CONTAINER
# ==========================================================
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Hot reload bawaan Nest (tsc watch)
CMD ["npm", "run", "start:dev"]
