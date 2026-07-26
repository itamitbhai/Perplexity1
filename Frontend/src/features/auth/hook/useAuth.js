import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";


export function useAuth() {


    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            await register({ email, username, password })
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch {
            // a failed session check just means "not logged in" - not a user-facing error
            dispatch(setUser(null))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            await logout()
        } catch {
            // clear local session even if the server request fails
        } finally {
            dispatch(setUser(null))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
    }

}