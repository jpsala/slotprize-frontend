
Manages the different Countries configured by the producer and their languages.

- [ ] This page will contain an "ADD LANGUAGE" Button that will allow the producer to add a language to the game by filling a form with the following information:
- [ ] Country (USA, UK, Canada, France, etc)
- [ ] Upload Country Icon (Flag of the country on PNG)
- [ ] Set Language in a text field (English, Spanish, French, etc) - Once set a new language this language becomes a enum for the system
- [ ] Upload TXT file (containing the json with all the txts of the game in that language)
- [ ] Set the currency of the Country (USD, EUR, Pound, etc)
- [ ] It's important to have in consideration the possibility of having different countries with the same language, so, if USA and UK are both present in the game, the producer will have to add both countries as different ones, to USA assign USD as currency, to UK assign Pounds as currency, the producer can use the same TXT json for both countries (uploading the same file two times) if the language English is already present in the system he'll be able to pick it from a list instead of input a new one in the text field.
- [ ] Every time a new LANGUAGE is added to the game, this change should propagate to the rest of the system. (Example: If the producer adds the country of Portugal and portuguese as a new language, in the raffle page it should appear this new language to be filled for each upcoming and ongoing raffle)


