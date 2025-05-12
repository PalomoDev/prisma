import SignUpForm  from "./sign-up-form"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';




const SignUpPage = async () => {
    return (
        <div className='w-full max-w-md mx-auto'>
            <Card>
                <CardHeader className='space-y-4'>
                    <CardTitle className='text-center'>Create Account</CardTitle>
                    <CardDescription className='text-center'>
                        Enter your information below to sign up
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUpPage