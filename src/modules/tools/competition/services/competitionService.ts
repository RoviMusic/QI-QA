export class CompetenciaService {
  async authMLToken() {
    const url = "http://187.189.243.250:3500/api/token";
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Basic SmF6OlB6dlc3NzArKEkmIi1bTzM5bS1gJA=="
    );
    myHeaders.append("Cookie", "PHPSESSID=knp29skeuae0ful6abkfuhnshq");

    const response = await fetch(url, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    });

    return response.json();
  }

  async couchData() {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Basic SmF6OlB6dlc3NzArKEkmIi1bTzM5bS1gJA=="
    );
    myHeaders.append("Cookie", "PHPSESSID=knp29skeuae0ful6abkfuhnshq");

    const response = await fetch("http://187.189.243.250:3500/api/couch.php?url=/ml_competition/_all_docs?include_docs=true", {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    })

    return response.json();
  }
}

export const competenciaService = new CompetenciaService();
