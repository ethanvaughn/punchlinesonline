import { useState, type ReactNode } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import { AuthContext } from './context'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type MeData = { me: User | null }
type SignInData = { signInWithPassword: (User & { token: string }) | null }
type SignInVariables = { email: string; password: string }
type RegisterData = { registerWithPassword: { errors: Array<{ message: string }>; result: User | null } }
type RegisterVariables = { input: { email: string; firstName: string; lastName: string; password: string } }

const ME_QUERY = gql`
  query Me {
    me { id firstName lastName email }
  }
`

const SIGN_IN_MUTATION = gql`
  mutation SignInWithPassword($email: String!, $password: String!) {
    signInWithPassword(email: $email, password: $password) {
      id firstName lastName email token
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation RegisterWithPassword($input: RegisterWithPasswordInput!) {
    registerWithPassword(input: $input) {
      errors { message }
      result { id firstName lastName email }
    }
  }
`

export function AuthProvider({ children }: { children: ReactNode }) {
  const hasToken = Boolean(localStorage.getItem('token'))
  const { data, loading: queryLoading } = useQuery<MeData>(ME_QUERY, { skip: !hasToken })
  const [signInMutation] = useMutation<SignInData, SignInVariables>(SIGN_IN_MUTATION)
  const [registerMutation] = useMutation<RegisterData, RegisterVariables>(REGISTER_MUTATION)
  const client = useApolloClient()
  const [signedInUser, setSignedInUser] = useState<User | null>(null)
  const user = signedInUser ?? data?.me ?? null

  const signIn = async (email: string, password: string) => {
    const { data: result } = await signInMutation({ variables: { email, password } })
    const signedInUser = result?.signInWithPassword

    if (!signedInUser?.token) throw new Error('We could not sign you in with those details.')
    localStorage.setItem('token', signedInUser.token)
    setSignedInUser(signedInUser)
  }

  const register = async (input: RegisterVariables['input']) => {
    const { data: result } = await registerMutation({ variables: { input } })
    const errors = result?.registerWithPassword?.errors ?? []
    if (errors.length > 0) throw new Error(errors.map((error) => error.message).join(', '))
  }

  const logout = () => {
    localStorage.removeItem('token')
    setSignedInUser(null)
    void client.clearStore()
    window.location.assign('/signin')
  }

  return <AuthContext.Provider value={{ user, loading: hasToken && queryLoading, signIn, register, logout }}>{children}</AuthContext.Provider>
}
