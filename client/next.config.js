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

	webpack: (config) => {
		config.resolve.alias["@components"] = path.join(__dirname, "components");
		config.resolve.alias["@lib"] = path.join(__dirname, "lib");

		return config;
	},
};

module.exports = nextConfig;
