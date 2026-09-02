defmodule Base52UUIDTest do
  use ExUnit.Case, async: true

  test "generates a prefixed ID with a 23-character Base52 payload" do
    assert ["foosers", payload] = Base52UUID.prefixed("foosers") |> String.split("-", parts: 2)

    assert String.length(payload) == 23
    assert payload =~ ~r/^[A-Za-z]+$/
    assert Base52UUID.valid?("foosers-#{payload}", "foosers")
  end

  test "supports arbitrary table names" do
    assert ["audit_logs", payload] =
             Base52UUID.prefixed("audit_logs") |> String.split("-", parts: 2)

    assert String.length(payload) == 23
    assert payload =~ ~r/^[A-Za-z]+$/
    assert Base52UUID.valid?("audit_logs-#{payload}", "audit_logs")
  end

  test "generates different IDs" do
    assert Base52UUID.prefixed("foosers") != Base52UUID.prefixed("foosers")

    assert Base52UUID.prefixed("barries") != Base52UUID.prefixed("barries")
  end

  test "generates 1000 unique IDs" do
    ids = for _ <- 1..1000, do: Base52UUID.prefixed("foosers")
    # IO.inspect(ids, label: "1000 generated IDs", limit: :infinity)

    assert Enum.uniq(ids) |> length() == 1000
  end
end
