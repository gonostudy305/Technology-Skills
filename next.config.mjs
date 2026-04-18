/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "it.uel.edu.vn",
			},
		],
	},
};

export default nextConfig;
