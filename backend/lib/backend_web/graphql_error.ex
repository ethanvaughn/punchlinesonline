unless Code.ensure_loaded?(AshGraphql.Error.AshAuthentication.Errors.AuthenticationFailed) do
  defimpl AshGraphql.Error, for: AshAuthentication.Errors.AuthenticationFailed do
    def to_error(_error) do
      %{
        message: "Authentication failed",
        short_message: "Authentication failed",
        fields: [],
        code: "authentication_failed",
        vars: %{}
      }
    end
  end
end
