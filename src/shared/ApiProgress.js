import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';


export const useApiProgress = (apiPath) => {
  const [pendingApiCall, setPendingApiCall] = useState(false)

  useEffect(() => {//normalde demiştik ya ikinci parametre neye bağlı olduğunu bildirir . Biz bunu belirtmezsek DidMount edildiği zaman çalışıcak
    let requestInterceptor, responseInterceptor;

    const updateApiCallFor = (url, inProgress) => {
      if (url.startsWith(apiPath)) {
        setPendingApiCall(inProgress)
      }
    };

    const registerInterceptor = () => {
      requestInterceptor = axios.interceptors.request.use(request => {
        updateApiCallFor(request.url, true);
        return request;
      });

      responseInterceptor = axios.interceptors.response.use(
        response => {
          updateApiCallFor(response.config.url, false);
          return response;
        },
        error => {
          updateApiCallFor(error.config.url, false);
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
  }, [apiPath])

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
