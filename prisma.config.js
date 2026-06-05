// prisma.config.js
module.exports = {
  datasource: {
    // On écrit directement la chaîne de connexion ici pour la CLI
    // ou on s'assure qu'elle pointe bien sur l'URL de votre base Docker
    url: "postgresql://postgres:postgres@localhost:5432/pocket_logistics_db?schema=public",
  },
}