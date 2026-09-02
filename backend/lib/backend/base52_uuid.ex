defmodule Base52UUID do
  use ShortUUID.Builder, alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

  @payload_length 23

  def prefixed(table_name) when is_binary(table_name) do
    "#{table_name}-#{encode!(Ecto.UUID.generate())}"
  end

  def valid?(value, table_name) when is_binary(value) and is_binary(table_name) do
    case String.split(value, "-", parts: 2) do
      [^table_name, payload] ->
        String.length(payload) == @payload_length and
          String.match?(payload, ~r/^[A-Za-z]+$/)

      _ ->
        false
    end
  end
end
