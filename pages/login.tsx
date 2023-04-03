import { NextPage } from "next";
import React, { useState } from "react";
import Image from "next/image";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Error from "../components/error";

import { TbEye, TbEyeOff } from "react-icons/tb";


const Login: NextPage = () =>
{
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [pwVisible, setPwVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    setError(false);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: username as string,
      password: password as string,
    });

    setLoading(false);

    if (error)
    {
      setError(true);
      setErrorMessage(error.message);
      return;
    }

    if (data)
    {
      await router.push("/dashboard");
    }
  };

  if (session)
  {
    router.push("/dashboard");
  }

  return (
    <Layout title="Officer Login" sidebarHidden>
      <div className="my-32 max-w-md w-full mx-auto">
        <h1 className="font-bold text-white text-center">
          <Image
            src="/images/CougarCS-logo.png"
            alt="CougarCS Logo"
            width={150}
            height={150}
          />
          <br />
          CougarCS Login
        </h1>

        <p className="mt-1 text-center text-sm text-gray-500">
          Don&#39;t have an account? Contact the{" "}
          <a className="text-red-500">Webmaster</a>.
        </p>

        <div className="mt-8 rounded-md border border-zinc-700 px-8 pt-5 pb-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div id="username-input">
              <label htmlFor="username" className="text-sm font-bold after:content-['*'] after:text-red-500 after:align-sub">Username </label>
              <input type="text" id="username" name="username" placeholder="Web Developer" className="placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-blue-500 w-full h-9 rounded-sm text-sm px-4 bg-zinc-800 border border-zinc-700" required />
            </div>

            <div id="password-input">
              <label htmlFor="password" className="text-sm font-bold after:content-['*'] after:text-red-500 after:align-sub">Password </label>
              <div className="flex flex-row">
                <input type={!pwVisible ? "password" : "input"} id="password" name="password" placeholder="Password" className="placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-blue-500 w-full h-9 rounded-sm rounded-r-none text-sm px-4 bg-zinc-800 border border-zinc-700 border-r-0" required />
                <button type="button" className="p-2 bg-zinc-800 border border-zinc-700 border-l-0 rounded-r-sm" onClick={() => setPwVisible(!pwVisible)}>{!pwVisible ? <TbEye /> : <TbEyeOff />}</button>
              </div>
            </div>

            <button type="submit" className="w-full text-white font-semibold text-sm h-9 rounded-sm bg-red-600 hover:bg-red-700">Sign in</button>
          </form>
        </div>
      </div>
      {error && <Error>{errorMessage}</Error>}
    </Layout>
  );
};

export default Login;
