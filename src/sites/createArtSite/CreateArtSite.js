import {Form} from "../../components/form/Form";
import {FormInput} from "../../components/formInput/FormInput";
import {useLocation} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, {useState} from "react";
import axios from "axios";


export function CreateArtSite() {
    const [error, setError] = useState("");
    const email = localStorage.getItem("user-email") || "";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState(null);  // Update state for file
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const navigate = useNavigate();

    const uploadArt = async (event) => {
        event.preventDefault();
        setError("")

        if (title === "" || description === "" || price < 0 || !file) {
            setError("Some inputs are filled incorrectly");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('file', file); // Append the file itself, not just the name

            const response = await axios.post(
                `${serverUrl}/api/art/create.php`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const data = response.data;
            console.log(data);

            if (data.success){
                alert("Art Successfully Created")
                navigate('/');
            }

        } catch (error) {
            setError(error.message);
            console.error("Error creating art: ", error);
        }
    };

    return (
        <div className="login-container">
            <h2>Upload Art</h2>
            <Form onSubmit={uploadArt}
                  error={error}
                  submitLabel="Upload Art"
                  buttonClassName="button-dark mb-1">
                <FormInput
                    label="Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <FormInput
                    label="Description"
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <FormInput
                    label="Price €"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <FormInput
                    label="File"
                    type="file"
                    name="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}  // Update file state
                    required
                />
            </Form>
        </div>
    )
}