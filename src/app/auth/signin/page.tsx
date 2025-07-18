"use client";
import { Eye, EyeClosed, Key, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { IUserCredentials } from '@/types/zTypes';
import { openGithubPopup } from '@/services/openGithubPopup';
import { ErrorHelper } from '@/helpers/ErrorHelper';
import { ApiStatusEnum } from '@/types/enum/ApiStatus.enum';
import { ApiType } from '@/types/ApiResponse.type';
import { ApiUrl } from '@/types/ApiUrl.type';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ApiUser } from '@/services/api';

const Login = () => {
    const initial: IUserCredentials = { mail: "", password: "" }
    const [credentials, setCredentials] = useState<IUserCredentials>(initial);
    const [showPass, setShowPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [windowError, setWindowError] = useState<string | null>(null);
    const [openError, setOpenError] = useState<boolean>(false);
    const [data, setData] = useLocalStorage<ApiType.Login>("session", null);

    const login = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    useEffect(() => {
        async function handleMessage(event: MessageEvent) {
            if (event.origin !== window.origin && !event.data.code) return;

            if (event.data.type === "session-success") {
                const response: ApiType.Login | ErrorHelper = await ApiUser.githubSignIn(event.data.code);
                console.log(response);

                if (response instanceof ErrorHelper) {
                    setWindowError(response.message);
                    setLoading(false);
                    setOpenError(true);

                } else {
                    console.log("here");
                    setData(response);
                    window.location.href = ApiUrl.dashboard;
                }
            }
        }

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage)
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name } = e.target;
        let { value } = e.target;

        if (name === "fire_signal") {
            name = "mail";
            value = value.toLowerCase();
        }

        setCredentials({ ...credentials, [name]: value });
    };

    const openPopup = async () => {
        try {
            await openGithubPopup();

        } catch (error) {

            if (error instanceof ErrorHelper) {
                if (error.message === ApiStatusEnum.WINDOW_CLOSED_BY_USER) {
                    setWindowError("The Popup was closed, try again");

                } else if (error.message === ApiStatusEnum.WINDOW_FAILED_TO_OPEN) {
                    setWindowError("Failed to open Popup, try again or contact support");
                }

                setLoading(false);
                setOpenError(true);
            }
        }
    };

    return (
        <>
            {/* <div
                className={`z-40 top-0 bg-neutral-950 w-full sticky h-[70px] ease-in-out transition-transform duration-75 `}>

                <NavBar minimize={loading} title='LogIn to CodeSaucer' />
            </div> */}

            <div className='px-4 w-full h-[100vh] top-0 pt-[70px] flex flex-col items-center'>
                {/* <div className='text-4xl w-fit font-semibold mb-4'>
                    Sign in to CodeSaucer
                </div> */}

                <div className='relative w-1/6'>
                </div>

                <div
                    className='px-16 relative ebox-5/neutral-800 ebox-line-neutral-500 border border-neutral-500 w-2/5 not-md:w-9/10 bg-neutral-900 h-fit p-6 ebox-re-perspective-1/500'
                >

                    <div className='w-full flex justify-around'>
                        <button
                            disabled={loading}
                            onClick={() => {
                                setLoading(true);
                                openPopup();
                            }}
                            className="disabled:opacity-65 disabled:cursor-not-allowed focus:outline-1 focus:outline-violet-700 cursor-pointer w-4/5 border border-neutral-500 key-sh-[#00000000] key-bg-[#00000000] key-button-[60deg] bg-transparent rounded-[8px] mb-5"
                        >
                            <span className="p-1.5 hover:-translate-y-[0.33em] -skew-x-2 mb-[2px] mr-[2px] hover:-translate-x-[0.3em] active:translate-0 border bg-[#121212] border-white -translate-y-[0.2em] -translate-x-[0.2em] transition-all duration-100 ease-in">
                                <div className='w-full flex justify-center'>
                                    <svg
                                        className='mr-2'
                                        width={24} height={24} stroke="#d4d4d4" viewBox="0 0 128 128"
                                    >
                                        <g fill="#d4d4d4">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"></path>
                                            <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
                                        </g>
                                    </svg>
                                    Continue with Github
                                </div>
                            </span>
                        </button>
                    </div>

                    <div className='w-full flex justify-around'>
                        <button
                            disabled={loading}
                            className="disabled:opacity-65 disabled:cursor-not-allowed focus:outline-1 focus:outline-violet-700 w-4/5 self-center cursor-pointer border border-neutral-500 key-sh-[#00000000] key-bg-[#00000000] key-button-[60deg] bg-transparent rounded-[8px]">
                            <span className="p-2 hover:-translate-y-[0.33em] -skew-x-2 mb-[2px] mr-[2px] hover:-translate-x-[0.3em] active:translate-0 border bg-[#121212] border-white -translate-y-[0.2em] -translate-x-[0.2em] transition-all duration-100 ease-in">
                                <div className='w-full flex justify-center'>
                                    <svg
                                        className='mr-2'
                                        width={22} height={22} viewBox="0 0 128 128"
                                    >
                                        <path fill="#d4d4d4" d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"></path>
                                        <path fill="#d4d4d4" d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"></path>
                                        <path fill="#d4d4d4" d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"></path>
                                        <path fill="#d4d4d4" d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"></path>
                                        <path fill="#d4d4d4" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"></path>
                                    </svg>
                                    Continue with Google
                                </div>
                            </span>
                        </button>
                    </div>

                    <div className='w-full flex justify-center my-6'>
                        <div className='bg-neutral-400 h-px w-2/5 mt-3'>
                        </div>
                        <span className='px-2 bg-neutral-900'>
                            or
                        </span>
                        <div className='bg-neutral-400 h-px w-2/5 mt-3'>
                        </div>
                    </div>

                    <form
                        autoComplete="off"
                        className='flex-row'
                        onSubmit={(x) => login(x)}
                    >
                        <div className='flex-row outline-1 bg-neutral-800 mb-5'>
                            <label
                                className='w-full text-xs ml-2'
                                htmlFor="fire_signal"
                            >Mail</label>
                            <div className='flex ml-2'>
                                <Mail />
                                <input
                                    disabled={loading}
                                    placeholder='example@mail.com'
                                    onChange={(e) => handleChange(e)}
                                    className='px-3 py-1 bg-transparent w-full outline-0 focus:outline-offset-0'
                                    type="text" name="fire_signal" id="fire_signal"
                                    value={credentials?.mail || ""}
                                />
                            </div>
                        </div>

                        <div className='flex-row outline-1 bg-neutral-800 mb-5'>
                            <label
                                className='w-full text-xs ml-2'
                                htmlFor="password"
                            >Password</label>
                            <div className='flex ml-2'>
                                <Key />
                                <input
                                    disabled={loading}
                                    autoComplete="new-password"
                                    placeholder='*******'
                                    onChange={(e) => handleChange(e)}
                                    className='px-3 py-1 bg-transparent outline-0 focus:outline-offset-0 w-full'
                                    type={showPass ? "text" : "password"} name="password" id="password"
                                    value={credentials?.password || ""}
                                />
                                <div
                                    onMouseDown={() => setShowPass(true)}
                                    onMouseUp={() => setShowPass(false)}
                                    className='bg-neutral-800 p-1 cursor-pointer'>
                                    {
                                        showPass ?
                                            <Eye />
                                            :
                                            <EyeClosed />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='w-full flex justify-center mb-3'>
                            <button
                                disabled={loading}
                                type="submit"
                                className="flex disabled:cursor-not-allowed focus:outline-1 focus:outline-violet-700 cursor-pointer border border-neutral-500 key-sh-[#00000000] key-bg-[#00000000] key-button-[60deg] bg-transparent rounded-[8px]"
                            >
                                {loading ?
                                    <>
                                        <span className="font-extrabold animate-bounce [animation-delay:0ms] pl-3 py-2">.</span>
                                        <span className="font-extrabold animate-bounce [animation-delay:200ms] py-2">.</span>
                                        <span className="font-extrabold animate-bounce [animation-delay:400ms] pr-3 py-2">.</span>
                                    </>
                                    :
                                    <span className="p-2 hover:-translate-y-[0.33em] -skew-x-2 mb-[2px] mr-[2px] hover:-translate-x-[0.3em] active:translate-0 border bg-[#121212] border-white -translate-y-[0.2em] -translate-x-[0.2em] transition-all duration-100 ease-in">
                                        Log In
                                    </span>
                                }
                            </button>
                        </div>

                        <div className='w-full text-center'>Not registered yet?{" "}
                            <span onClick={() => null} className='underline cursor-pointer'>
                                Create an account
                            </span>
                        </div>
                    </form>

                    {/* <div className='relative w-3/6 top-0 left-0'> */}
                    <div
                        className={`w-1/2 top-5 left-full absolute inline-block ease-in-out transition-all ebox-5/red-300 ebox-line-red-800 max-w-full text-red-800 ebox-re-perspective-400/1000 origin-left duration-700 ${openError ? "delay-700 scale-100" : "delay-100 scale-0"}`}>
                        <div className='border-b flex justify-end border-red-800 font-bold px-2 text-red-800 text-xl h-fit bg-red-200'>
                            <span onClick={() => setOpenError(false)} className='cursor-pointer'>
                                - x
                            </span>
                        </div>
                        <div className='px-2 py-3 bg-red-200'>
                            {windowError}
                        </div>
                    </div>
                    {/* </div> */}
                </div>

            </div>
        </>
    );
};
export default Login;