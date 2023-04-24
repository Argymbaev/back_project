import axios from "axios";

const $axios = axios.create();

$axios.interceptors.request.use(
	async (config) => {
		const tokens = JSON.parse(localStorage.getItem("tokens"));
		if (tokens) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${tokens.access}`,
			};
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

$axios.interceptors.response.use((response) => {
	return response;
}, async (error)=> {
	const config = error.config;
	if(error.response) {
		if(error.response.status === 401 && ! config._retry){
			config ._retry = tru
			const access = await refreshAccessToken();
			axios.defaults.headers.common['Authorization'] = `Bearer ${acccess}`;
			return $axios(config);
		}
	}
});

async function refreshAccessToken() {
	try {
	  const tokens = JSON.parse(localStorage.getItem("tokens"));
	  if (!tokens) {
		return;
	  }
  
	  const { data } = await axios.post(`${BASE_URL}/auth/jwt/refresh/`, {
		refresh: tokens.refresh,
	  });
	  localStorage.setItem({
		access: data.access,
		refresh: tokens.refresh,
	  });
  
	  return data.access;
	} catch (error) {
	  localStorage.removeItem("tokens");
	}
  }
  
  export default $axios;