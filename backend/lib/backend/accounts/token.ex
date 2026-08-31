defmodule Backend.Accounts.Token do
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Accounts,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAuthentication.TokenResource],
    authorizers: [Ash.Policy.Authorizer]

  postgres do
    table("tokens")
    repo(Backend.Repo)
  end

  policies do
    bypass AshAuthentication.Checks.AshAuthenticationInteraction do
      authorize_if(always())
    end
  end
end
