import LoginForm from "@/app/(auth)/login/LoginForm";
import {auth} from "@/auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
    const session = await auth()
    if (session) {
        redirect('/')
    }

    return (
        <div className="text-black">
            <LoginForm/>
        </div>
    )
}

export default LoginPage