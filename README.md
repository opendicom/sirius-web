![logo_horizontal](./img/logo_horizontal_github.png)



**Sirius Web** is a module that allows you to interact with [**Sirius RIS**](https://github.com/opendicom/sirius-ris) `backend` from a DMZ or particular Hosting. It is designed as a module for **consulting results** and **requesting appointments** from the web.



---



To use the **Sirius Web** module you must build the **bundles** of the application that are located in the `/src` directory which must then be located on the web server of your choice.

**Bundles** are not provided within this repository since you must first establish the **organization settings** before build.



---



## How to build

* In case there is a previous installation of **Angular** on the computer:

```bash
npm uninstall -g @angular-cli
npm cache verify
npm cache clean --force
```



* Install **Angular 13** [ Specific version in which **Sirius Web** is written ]:

```bash
npm install -g @angular/cli@13.1.2
npm install -g @angular-devkit/build-angular@13.1.2
npm install --save-dev @angular-devkit/build-angular@13.3.4
```



* Install dependencies [ Run inside project `src` folder ]:

```bash
npm install
```



* Build the project [ Run inside project `src` folder ]:

```bash
ng build
```



---



## License

**Sirius Web** is licensed by [Mozilla Public License 2.0](https://choosealicense.com/licenses/mpl-2.0/).
