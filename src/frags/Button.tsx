import type { HTMLProps } from "react";

export const Button = (props: HTMLProps<HTMLButtonElement>) => (
    <button className="cursor-pointer rounded-lg border border-transparent px-3 py-2 text-base font-medium bg-gray-900 text-white transition duration-250 hover:border-indigo-500 focus:outline focus:outline-4 focus:outline-blue-500 disabled:border-gray-200 disabled:bg-gray-500 disabled:text-gray-600 disabled:cursor-not-allowed mx-2" {...props} type='button' />
)