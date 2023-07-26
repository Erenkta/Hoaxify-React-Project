import React, { Component } from 'react';
import axios from 'axios';


function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export function withApiProgress(WrappedComponent, apiPath) {

    return class extends Component {
        // static displayName = 'ApiProgress (' + getDisplayName(WrappedComponent) + ')'
        static displayName = `ApiProgress(${getDisplayName(WrappedComponent)})`
        state = {
            pendingApiCall: false
        }

        componentDidMount() {//Component ekrana ilk koyulduğu an
            console.log("Login Page added to screen");
            axios.interceptors.request.use((request) => {
                this.updateApiCallFor(request.url, true) //İşlemlerimizi response ve request'in path'lerine göre yaptık ki karışmasın
                return request;
            })
            axios.interceptors.response.use((response) => {
                this.updateApiCallFor(response.config.url, false)

                return response
            }, (error) => { //Burası da hataya düşen response'lar için
                this.updateApiCallFor(error.config.url, false)
                throw error; //Eğer hata varsa error'u fırlattık
            })
        }

        updateApiCallFor = (url, state) => { //Bu işlem bize aynı state üzerinde işlem gören fakat farklı response ve requestlerin birbirinden  bağımsız çalışmasını sağladı
            if (url === apiPath) {
                this.setState({
                    pendingApiCall: state
                })
            }
        }

        render() {
            const { pendingApiCall } = this.state
            return (
                <WrappedComponent pendingApiCall /* bu da döndürdüğü parametre ismi*/={pendingApiCall /*this.state kısmı bura */} {... this.props} />
            );
        }
    }
}



/*
    Child'a component paslamak için = 

    {React.cloneElement(this.props.children, {
    pendingApiCall: this.state.pendingApiCall //Burda parametreleri JSON Body olarak verdik
    })}


 */
/*
    ApiProgress'i bir high order component'a dönüştüreceğiz
    high order componentlar with ile isimlendirilir withApiProgress
    high order component'la alakalı ==> UserSignUp page'de enn altta kullanırken hiyerarşisi önemli çünkü burada mesela sadece pendingApiCall'ı pasladık diğer aldığı componentları paslamadık
    bunun da çözümü {... this.props} ile tümm componentları pasladık || '...' spread operator 
    mutlaka high order componet kullanırken muhtemel property'leri pasladığımıza emin olalım
    static displayName = 'ApiProgress'    Google'da components tab'ında gözüken ismi değiştirdik
    static displayName = 'ApiProgress (' + getDisplayName(WrappedComponent) + ')'     bu da anlamı bir isim gösteriyor
    static displayName = `ApiProgress(${getDisplayName(WrappedComponent)})` bunla aynı sonuc back tik diye geçiyor

*/