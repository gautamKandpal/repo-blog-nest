import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    // console.log(e.target.value);
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setError("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_BASE_URL}/auth/sign-up`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = res.data;
      // console.log(data);
      if (data.success === false) {
        return setError(data.message);
      }
      setLoading(false);
      navigate("/sign-in");
    } catch (err) {
      // console.log(err);
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className=" font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Blog
            </span>
            Nest
          </Link>
          <p className="text-sm mt-5 " style={{ textAlign: "justify" }}>
            BlogNest is a platform where users can easily create and publish
            blogs that are visible to everyone, enabling you to share your
            stories, insights, and ideas with a global audience. You can sign up
            with your email and password or with Google.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3"> Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an acount?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
