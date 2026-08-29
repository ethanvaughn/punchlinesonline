ARG ELIXIR_VERSION=1.18.4
ARG OTP_VERSION=27.3.4
ARG DEBIAN_VERSION=bookworm-20250610-slim

FROM hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}

ARG PHOENIX_VERSION=1.8.13

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       build-essential git curl ca-certificates inotify-tools \
       postgresql-client \
  && rm -rf /var/lib/apt/lists/*

RUN mix local.hex --force \
  && mix local.rebar --force \
  && mix archive.install hex phx_new ${PHOENIX_VERSION} --force

WORKDIR /workspace
