defmodule Backend.Accounts do
  use Ash.Domain,
    otp_app: :backend,
    extensions: [AshGraphql.Domain]

  resources do
    resource(Backend.Accounts.User)
    resource(Backend.Accounts.Token)
  end
end
