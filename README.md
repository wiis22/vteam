# Grupp 3.2 Göteburgare Projekt

Detta projekt har skapats som en del av kursen **Programutveckling i virtuella team** vid BTH. Målet med projektet är att utveckla ett komplett system för elcykeluthyrning, bestående av flera delsystem:

- **Webbapplikation**  
- **Mobilapp**
- **REST API**    
- **Databas**

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/wiis22/vteam/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/wiis22/vteam/?branch=main) [![Build Status](https://scrutinizer-ci.com/g/wiis22/vteam/badges/build.png?b=main)](https://scrutinizer-ci.com/g/wiis22/vteam/build-status/main)

## Setup

### Installera Docker
1. Se till att Docker är installerat på din maskin. Du kan ladda ner det från [Dockers officiella webbplats](https://www.docker.com/get-started).

### Kör Projektet:
1. Klona repot:
    ```
    git clone https://github.com/wiis22/vteam.git
    ```
2. Navigera till projektets rotkatalog:
    ```
    cd vteam
    ```
3. Starta tjänsterna med Docker Compose:
    ```
    docker-compose up
    ```

    ### Applikationer

    #### Webbapplikation
    en React-app och kan nås via:
    ```
    http://localhost:3000
    ```

    #### Mobilapp
    en standard JavaScript-webbapplikation som stilitiskt anpassats för mobila enheter, kan nås via:
    ```
    http://localhost:3001
    ```

    #### REST API
    en Node.js, Express app, kan nås via:
    ```
    http://localhost:1337/api
    ```


## [vTeam Kurs](https://dbwebb.se/kurser/vteam-v1)
> Kursen **Programutveckling i virtuella team**, a.k.a. **vteam**, lär ut avancerad programmering med webbteknologier och låter studenten fördjupa sig i ett flertal teknikområden inom nischen. Studenten får hantera verktyg och tekniker för att jobba med kodkvalitet och hur begrepp som “snygg kod” hanteras.
>
> Kursen syftar även till att lära ut programutveckling i grupp där studenter på campus och distans kan blandas i samma grupp. Arbetssätt och metoder introduceras för att stödja arbetet i grupp. Kursen syftar också till att hantera förutsättningar för “vad är ett gott och gynnsamt gruppklimat”.

## [SDS](https://docs.google.com/document/d/1QxlizgdFMmvR27M_3TKvvR09s-yHnffnF1hAyF4M8vg/edit?usp=sharing)
Utvecklingen av systemet är baserat på **3.2 Göteburgare**s gemensamma **SDS (System Design Specification)**, där projektets arkitektur och komponenter delats upp och förklarats.

> En **System Design Specification (SDS)** är en detaljerad dokumentation som beskriver struktur och design för ett system. Den har med mening att fungera som en brygga mellan kravspecifikationen från kunden och implementeringen av systemet från utvecklaren.
>
> SDS:ens syfte är att ge en tydlig och gemensam förståelse för systemets struktur, funktioner och interaktioner mellan dess olika komponenter.

För en djupare förklaring av systemet och kraven som <em>"kunden"</em> ställt, rekommenderas man att läsa projektets tillhörande SDS.

## Repo Struktur
>### Frontend
>- **Webbapplikation**
React app
>- **Mobilapp**
Standard JS application
>
>### Backend
>- **REST API**
Node.js (express) app
>- **Databas**
MongoDB Atlas database


## Länkar:
- **BTHs vTeams Kurs:**
https://dbwebb.se/kurser/vteam-v1
- **Github Repo:**
https://github.com/wiis22/vteam
- **System Design Specification:**
[https://docs.google.com/document](https://docs.google.com/document/d/1QxlizgdFMmvR27M_3TKvvR09s-yHnffnF1hAyF4M8vg/edit?usp=sharing)
- **Teknikval:**
[https://docs.google.com/document](https://docs.google.com/document/d/1rl6dHvK9hao-iylrrNPnkYbFsQVWvBznmGBQwgwGSMU/edit?tab=t.0#heading=h.3pu6optspj88)
- **Riskanalys:**
[https://docs.google.com/spreadsheets](https://docs.google.com/spreadsheets/d/1uWGOsD7XCI-gZdGmSLTlBpnRyvF0lSmlsk2LVZ3UqnQ/edit?gid=1435465983#gid=1435465983)
