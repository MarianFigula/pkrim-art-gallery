import {Form} from "../form/Form";
import React, {useState} from "react";
import {FormInput} from "../formInput/FormInput";
import {Link} from "react-router-dom";

// TODO: pridat aj security answer ?, opytat sa emy ako to chce riesit
export function ForgotPassword() {

    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatedPassword, setRepeatedPassword] = useState("")
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (password !== repeatedPassword) {
            setError("Password and Repeated password are not the same")
            return;
        }

        try {
            const response = await fetch(
                `${serverUrl}/api/user/forgotPassword.php`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        repeatedPassword,
                    })
                })

            const data = await response.json()
            console.log(data)

            if (!response.ok){
                setError(data.message)
            }

        } catch (error) {
            setError("Something failed. Please try again")
        }
    }

    return (
        <>
            <div className="login-container">
                <h2>Renew password</h2>
                <Form
                    error={error}
                    submitLabel="Change password"
                    buttonClassName="button-dark"
                    onSubmit={handleSubmit}
                >
                    <FormInput
                        label="Email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Repeat password"
                        type="password"
                        value={repeatedPassword}
                        onChange={(e) =>
                            setRepeatedPassword(e.target.value)}
                        required
                    />
                </Form>
                <div className="links">
                    <Link to={"/login"}>Sign in</Link>
                    <Link to={"/register"}>Sign up</Link>
                </div>
            </div>
        </>
    )
}