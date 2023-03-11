export const multiBackendApiCall = async axios_instances => {
  // Pass backend_api_urls as an array
  // call each api_url and store it in
  // [{state: 'success|error', base_url: '<BaseApiUrl>', response: response]
  return Promise.all(
    axios_instances.map(axios_instance =>
      axios_instance
        .then(({ status, data, config }) => {
          return { base_url: config?.baseURL, state: 'success', response: { status, data } }
        })
        .catch(error => ({
          base_url: error.response?.config?.baseURL,
          state: 'error',
          response: error.response,
        }))
    )
  )
}
