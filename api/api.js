const baseurl = "https://playstationappserver.vercel.app/api/";
// const baseurl = "http:// 192.168.68.169:8000/api/"

// Retry function with exponential backoff
const fetchWithRetry = async (url, options, maxRetries = 3) => {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            lastError = error;
            if (error.name !== 'AbortError' || attempt === maxRetries - 1) {
                throw error;
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            console.log(`Retrying request (attempt ${attempt + 2}/${maxRetries})...`);
        }
    }
    throw lastError;
};

export const fetchApi = async (route, method = 'GET', body = null) => {
    console.log("route:", route);

    const url = baseurl + route;
    console.log('Making request to:', url);
    console.log('Method:', method);
    console.log('Body:', body);

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    };

    if (method !== 'GET' && body) {
        options.body = JSON.stringify(body);
    }

    try {
        console.log('Starting request to:', url);
        const response = await fetchWithRetry(url, options);

        console.log('Response received:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (response.status === 404) {
            throw new Error(`Endpoint not found: ${route}. Please check if the API route is correct and the server is running.`);
        }

        if (response.status === 504) {
            throw new Error(`Gateway timeout. The server took too long to respond. Please try again or contact support if the issue persists.`);
        }

        const responseText = await response.text();
        console.log("Raw response text:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
            throw new Error(`Invalid JSON response from server: ${responseText}`);
        }

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    }
    catch (error) {
        console.error("Fetch Error:", {
            message: error.message,
            name: error.name,
            url,
            method,
            route
        });

        return {
            error: error.message,
            details: {
                url,
                method,
                route,
                timestamp: new Date().toISOString()
            }
        };
    }
};

export const getAllProducts = async () => {
    console.log('Fetching all products...');
    const response = await fetchApi("products/getAllProducts", "GET");
    console.log('API Response in getAllProducts:', response);
    return response;
};

export const createUser = async (body) => {
    console.log('Creating user with data:', body);
    return await fetchApi("users/createuser", "POST", body);
};

export const loginFe = async (body) => {
    console.log('Logging in with data:', body);
    return await fetchApi("users/logIn", "POST", body);
};

export const LoginUser = (body) => {
    const route = "users/login";
    return fetchApi(route, "POST", body);
}

export const updateUser = async (body) => {
    console.log('Updating user with data:', body);
    return await fetchApi("users/updateUser", "POST", body);
};

export const createProduct = async (productData) => {
    console.log('Creating product with data:', productData);

    // Validate required fields
    if (!productData.Name || !productData.color || !Array.isArray(productData.color) || !productData.category) {
        return {
            error: "Missing required fields. Product must have Name, color array, and category"
        };
    }

    // Validate color array structure
    for (const colorItem of productData.color) {
        if (!colorItem.colorName || !colorItem.color || !Array.isArray(colorItem.images) || colorItem.images.length === 0) {
            return {
                error: "Invalid color item structure. Each color must have colorName, color, and at least one image"
            };
        }
    }

    return await fetchApi("/createProduct", "POST", productData);
};

export const getProductsByCategory = async (category) => {
    console.log('Fetching products by category:', category);
    return await fetchApi(`/getProductsByCategory/${category}`, "GET");
};

export const removeUser = async () => {
    console.log('Removing user session...');
    return await fetchApi("users/logout", "POST");
};
