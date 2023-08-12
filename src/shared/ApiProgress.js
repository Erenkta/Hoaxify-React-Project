import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';


export const useApiProgress = (apiMethod, apiPath, strictPath) => {
  const [pendingApiCall, setPendingApiCall] = useState(false)

  useEffect(() => {//normalde demiştik ya ikinci parametre neye bağlı olduğunu bildirir . Biz bunu belirtmezsek DidMount edildiği zaman çalışıcak
    let requestInterceptor, responseInterceptor;

    const updateApiCallFor = (method, url, inProgress) => {
      if (method !== apiMethod) {
        return;
      }
      if (strictPath && url === apiPath) {
        setPendingApiCall(inProgress)
      }
      else if (!strictPath && url.startsWith(apiPath)) {
        setPendingApiCall(inProgress)
      }
    };

    const registerInterceptor = () => {
      requestInterceptor = axios.interceptors.request.use(request => {
        const { url, method } = request
        updateApiCallFor(method, url, true);
        return request;
      });

      responseInterceptor = axios.interceptors.response.use(
        response => {
          const { url, method } = response.config
          updateApiCallFor(method, url, false);
          return response;
        },
        error => {
          const { url, method } = error.config
          updateApiCallFor(method, url, false);
          throw error;
        }
      );
    };

    const unRegisterInterceptor = () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    }
    registerInterceptor() //Export etmiş olduk buraya yazarak çağırdık

    return function unmount() { //UnMount olunca burası çağrılacak
      unRegisterInterceptor()
    }
  }, [apiPath, apiMethod, strictPath]);

  return pendingApiCall
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function withApiProgress(WrappedComponent, apiPath) {
  return class extends Component {
    static displayName = `ApiProgress(${getDisplayName(WrappedComponent)})`;

    state = {
      pendingApiCall: false
    };

    componentDidMount() {
      this.registerInterceptor()
    }
    componentWillUnmount() {
      this.unRegisterInterceptor()
    }
    //ComponentDidMount'un içini parçalara böldük



    render() {
      const pendingApiCall = this.state.pendingApiCall || this.props.pendingApiCall;
      return <WrappedComponent {...this.props} pendingApiCall={pendingApiCall} />;
    }
  };
}
