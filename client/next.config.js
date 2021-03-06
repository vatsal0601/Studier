/** @type {import('next').NextConfig} */

const path = require("path");
require("dotenv").config();

const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["images.unsplash.com", "localhost"],
	},
	env: {
		BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
	},
	publicRuntimeConfig: {
		BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
	},
};

module.exports = nextConfig;
