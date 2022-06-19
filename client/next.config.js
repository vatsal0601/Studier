/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["images.unsplash.com", "localhost"],
	},
	env: {
		BACKEND_URL: process.env.BACKEND_URL,
	},
	publicRuntimeConfig: {
		BACKEND_URL: process.env.BACKEND_URL,
	},
};

module.exports = nextConfig;
