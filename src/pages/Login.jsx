import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/image/login.svg";
import { setUser, signInUser } from "../redux/features/tasks/userSlice";
import { auth, db } from "../utils/firebase.config";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = ({ email, password }) => {
    // Email Password Login
    dispatch(signInUser({ email, password }));
    navigate("/");
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new document
        await setDoc(userDocRef, {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }

      // Explicitly update the Redux state before navigating
      dispatch(
        setUser({
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
        })
      );

      // Now navigate
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign in:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl min-h-screen items-center mx-auto p-4">
      <div className="w-full md:w-1/2 hidden md:block">
        <img src={loginImage} className="h-full w-full" alt="" />
      </div>
      <div className="w-full md:w-1/2 grid place-items-center">
        <div className="bg-primary/5 w-full max-w-sm rounded-lg grid place-items-center p-6 md:p-10">
          <h1 className="mb-6 md:mb-10 font-medium text-xl md:text-2xl">
            Login
          </h1>
          <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-start">
              <label htmlFor="email" className="mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-md"
                {...register("email")}
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="password" className="mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full rounded-md"
                {...register("password")}
              />
            </div>
            <div className="relative !mt-6 md:!mt-8">
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </div>
            <div className="text-sm md:text-base">
              <p>
                Don&apos;t have an account?{" "}
                <span
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </span>
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={handleGoogleLogin}
            >
              Login with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
