import sys
import uuid
from database import SessionLocal
import models

# 48 books requested by user
CLASSIC_BOOKS = [
    {
        "title": "The Iliad",
        "author": "Homer",
        "published_year": -750,
        "description": "An epic ancient Greek poem recounting the wrath of Achilles and the brutal siege of Troy during the final weeks of the Trojan War.",
        "price": 14.99,
        "isbn": "978-0140275360",
        "cover": "https://covers.openlibrary.org/b/id/8231856-L.jpg"
    },
    {
        "title": "The Odyssey",
        "author": "Homer",
        "published_year": -725,
        "description": "The ten-year perilous voyage of Odysseus striving to return home to Ithaca and his wife Penelope after the fall of Troy.",
        "price": 14.99,
        "isbn": "978-0140268867",
        "cover": "https://covers.openlibrary.org/b/id/8431872-L.jpg"
    },
    {
        "title": "Meditations",
        "author": "Marcus Aurelius",
        "published_year": 180,
        "description": "The personal private reflections of Roman Emperor Marcus Aurelius on Stoic philosophy, self-discipline, resilience, and duty.",
        "price": 11.99,
        "isbn": "978-0812968255",
        "cover": "https://covers.openlibrary.org/b/id/8775438-L.jpg"
    },
    {
        "title": "The Republic",
        "author": "Plato",
        "published_year": -375,
        "description": "Plato's seminal dialogue exploring justice, the ideal city-state ruled by philosopher-kings, and the famous Allegory of the Cave.",
        "price": 12.99,
        "isbn": "978-0140455113",
        "cover": "https://covers.openlibrary.org/b/id/8282821-L.jpg"
    },
    {
        "title": "The Aeneid",
        "author": "Virgil",
        "published_year": -19,
        "description": "Virgil's legendary Latin epic narrating the journey of Aeneas, a Trojan prince fleeing Troy to found the dynasty that birthed Rome.",
        "price": 13.99,
        "isbn": "978-0143105138",
        "cover": "https://covers.openlibrary.org/b/id/8231991-L.jpg"
    },
    {
        "title": "Don Quixote",
        "author": "Miguel de Cervantes",
        "published_year": 1605,
        "description": "The comical, profound misadventures of the idealistic hidalgo Don Quixote and his faithful squire Sancho Panza tilting at windmills.",
        "price": 16.99,
        "isbn": "978-0060934347",
        "cover": "https://covers.openlibrary.org/b/id/8314138-L.jpg"
    },
    {
        "title": "The Divine Comedy",
        "author": "Dante Alighieri",
        "published_year": 1320,
        "description": "Dante's allegorical visionary journey guided by Virgil and Beatrice through Inferno, Purgatorio, and Paradiso.",
        "price": 17.50,
        "isbn": "978-0142437223",
        "cover": "https://covers.openlibrary.org/b/id/8235111-L.jpg"
    },
    {
        "title": "The Name of the Rose",
        "author": "Umberto Eco",
        "published_year": 1980,
        "description": "A brilliant medieval monastery murder mystery infused with semiotics, biblical analysis, and philosophical intrigue.",
        "price": 15.99,
        "isbn": "978-0156001311",
        "cover": "https://covers.openlibrary.org/b/id/8228691-L.jpg"
    },
    {
        "title": "Beowulf",
        "author": "Anonymous (trans. Seamus Heaney)",
        "published_year": 1000,
        "description": "The heroic Old English epic of warrior Beowulf defending the Mead Hall against the monstrous Grendel and fiery dragon.",
        "price": 10.99,
        "isbn": "978-0393320978",
        "cover": "https://covers.openlibrary.org/b/id/8235222-L.jpg"
    },
    {
        "title": "The Canterbury Tales",
        "author": "Geoffrey Chaucer",
        "published_year": 1400,
        "description": "A diverse pilgrimage of colorful travelers journeying to Canterbury, exchanging tales of romance, irony, bawdiness, and faith.",
        "price": 13.50,
        "isbn": "978-0140424386",
        "cover": "https://covers.openlibrary.org/b/id/8235333-L.jpg"
    },
    {
        "title": "Hamlet",
        "author": "William Shakespeare",
        "published_year": 1601,
        "description": "Shakespeare's masterpiece tragedy of grief, madness, betrayal, and revenge in the phantom-haunted court of Elsinore, Denmark.",
        "price": 9.99,
        "isbn": "978-0743477123",
        "cover": "https://covers.openlibrary.org/b/id/8235444-L.jpg"
    },
    {
        "title": "King Lear",
        "author": "William Shakespeare",
        "published_year": 1606,
        "description": "An aging monarch divides his kingdom among flattering daughters, descending into stormy madness and tragic realization.",
        "price": 9.99,
        "isbn": "978-0743482769",
        "cover": "https://covers.openlibrary.org/b/id/8235555-L.jpg"
    },
    {
        "title": "Lolita",
        "author": "Vladimir Nabokov",
        "published_year": 1955,
        "description": "Nabokov's controversial, dazzlingly written examination of obsession, unreliable narration, and linguistic genius.",
        "price": 15.00,
        "isbn": "978-0679723165",
        "cover": "https://covers.openlibrary.org/b/id/8235666-L.jpg"
    },
    {
        "title": "Frankenstein",
        "author": "Mary Shelley",
        "published_year": 1818,
        "description": "Victor Frankenstein animates life from the dead, unleashing a lonely, articulate creation that demands reckoning with its creator.",
        "price": 10.99,
        "isbn": "978-0141439471",
        "cover": "https://covers.openlibrary.org/b/id/8235777-L.jpg"
    },
    {
        "title": "Crime and Punishment",
        "author": "Fyodor Dostoevsky",
        "published_year": 1866,
        "description": "Impoverished student Raskolnikov commits murder believing himself above morality, only to face psychological agony and redemption.",
        "price": 14.50,
        "isbn": "978-0140449136",
        "cover": "http://127.0.0.1:8000/uploads/crime_and_punishment.jpg"
    },
    {
        "title": "The Brothers Karamazov",
        "author": "Fyodor Dostoevsky",
        "published_year": 1880,
        "description": "A profound spiritual and philosophical drama probing faith, free will, morality, and patricide through three passionate brothers.",
        "price": 18.00,
        "isbn": "978-0374528379",
        "cover": "http://127.0.0.1:8000/uploads/the_brothers_karamazov.jpg"
    },
    {
        "title": "Anna Karenina",
        "author": "Leo Tolstoy",
        "published_year": 1877,
        "description": "A sweeping portrait of imperial Russian society, fateful passion, societal condemnation, and spiritual reconciliation.",
        "price": 16.99,
        "isbn": "978-0143035008",
        "cover": "https://covers.openlibrary.org/b/id/8235888-L.jpg"
    },
    {
        "title": "War and Peace",
        "author": "Leo Tolstoy",
        "published_year": 1869,
        "description": "Tolstoy's monumental epic tracking aristocratic families navigating Napoleon's invasion of Russia, love, war, and the search for meaning.",
        "price": 22.00,
        "isbn": "978-1400079988",
        "cover": "https://covers.openlibrary.org/b/id/8235999-L.jpg"
    },
    {
        "title": "Madame Bovary",
        "author": "Gustave Flaubert",
        "published_year": 1856,
        "description": "Emma Bovary seeks escape from provincial bourgeois boredom through romantic fantasies and ruinous infatuations.",
        "price": 12.00,
        "isbn": "978-0140449129",
        "cover": "https://covers.openlibrary.org/b/id/8236111-L.jpg"
    },
    {
        "title": "Middlemarch",
        "author": "George Eliot",
        "published_year": 1871,
        "description": "George Eliot's masterpiece study of provincial English life, idealism, flawed marriages, and social change.",
        "price": 15.50,
        "isbn": "978-0141439549",
        "cover": "https://covers.openlibrary.org/b/id/8236222-L.jpg"
    },
    {
        "title": "The Metamorphosis",
        "author": "Franz Kafka",
        "published_year": 1915,
        "description": "Gregor Samsa wakes up one morning to find himself transformed into a monstrous insect, exposing the alienation of modern life.",
        "price": 9.50,
        "isbn": "978-0143105244",
        "cover": "https://covers.openlibrary.org/b/id/8236333-L.jpg"
    },
    {
        "title": "The Trial",
        "author": "Franz Kafka",
        "published_year": 1925,
        "description": "Josef K. is suddenly arrested and prosecuted by a remote, inaccessible court for an unnamed and unknown crime.",
        "price": 11.50,
        "isbn": "978-0805210408",
        "cover": "https://covers.openlibrary.org/b/id/8236444-L.jpg"
    },
    {
        "title": "Ulysses",
        "author": "James Joyce",
        "published_year": 1922,
        "description": "A landmark modernist journey following Leopold Bloom through Dublin across a single ordinary, mythic day: June 16, 1904.",
        "price": 18.99,
        "isbn": "978-0679722762",
        "cover": "https://covers.openlibrary.org/b/id/8236555-L.jpg"
    },
    {
        "title": "The Aeneid (Penguin Clothbound)",
        "author": "Virgil",
        "published_year": 2010,
        "description": "Special luxury clothbound collector's edition of Robert Fagles' acclaimed translation of Rome's founding epic.",
        "price": 28.00,
        "isbn": "978-0141394145",
        "cover": "https://covers.openlibrary.org/b/id/8231991-L.jpg"
    },
    {
        "title": "Great Expectations",
        "author": "Charles Dickens",
        "published_year": 1861,
        "description": "Orphan Pip rises to sudden wealth through a mysterious benefactor, confronting snobbery, remorse, and true love along the marshes.",
        "price": 11.99,
        "isbn": "978-0141439563",
        "cover": "https://covers.openlibrary.org/b/id/8236666-L.jpg"
    },
    {
        "title": "Moby Dick",
        "author": "Herman Melville",
        "published_year": 1851,
        "description": "Captain Ahab's obsessive, doomed vendetta against the great white whale across the turbulent oceans of the Pequod.",
        "price": 13.99,
        "isbn": "978-0142437247",
        "cover": "https://covers.openlibrary.org/b/id/8236777-L.jpg"
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "published_year": 1813,
        "description": "Elizabeth Bennet matches wits with the proud, enigmatic Mr. Darcy in Austen's sparkling comedy of manners and affection.",
        "price": 10.99,
        "isbn": "978-0141439518",
        "cover": "https://covers.openlibrary.org/b/id/8236888-L.jpg"
    },
    {
        "title": "Jane Eyre",
        "author": "Charlotte Brontë",
        "published_year": 1847,
        "description": "An orphaned governess fights for independence, love, and moral integrity amidst the dark secrets of Thornfield Hall.",
        "price": 11.50,
        "isbn": "978-0141441146",
        "cover": "https://covers.openlibrary.org/b/id/8236999-L.jpg"
    },
    {
        "title": "A Portrait of the Artist as a Young Man",
        "author": "James Joyce",
        "published_year": 1916,
        "description": "Stephen Dedalus awakens spiritually, artistically, and philosophically, choosing exile to forge his singular creative voice.",
        "price": 12.50,
        "isbn": "978-0142437346",
        "cover": "https://covers.openlibrary.org/b/id/8237000-L.jpg"
    },
    {
        "title": "Wuthering Heights",
        "author": "Emily Brontë",
        "published_year": 1847,
        "description": "A tempestuous gothic tragedy of unbridled passion and demonic revenge between Heathcliff and Catherine across the Yorkshire moors.",
        "price": 11.99,
        "isbn": "978-0141439556",
        "cover": "https://covers.openlibrary.org/b/id/8237111-L.jpg"
    },
    {
        "title": "The Picture of Dorian Gray",
        "author": "Oscar Wilde",
        "published_year": 1890,
        "description": "A hedonistic young man sells his soul so his portrait ages while he remains eternally youthful and morally corrupt.",
        "price": 10.99,
        "isbn": "978-0141439570",
        "cover": "https://covers.openlibrary.org/b/id/8237150-L.jpg"
    },
    {
        "title": "The Handmaid's Tale",
        "author": "Margaret Atwood",
        "published_year": 1985,
        "description": "In the totalitarian Republic of Gilead, Offred struggles to survive and preserve her identity and memories as a Handmaid.",
        "price": 15.95,
        "isbn": "978-0385490818",
        "cover": "https://covers.openlibrary.org/b/id/8237222-L.jpg"
    },
    {
        "title": "Sense and Sensibility",
        "author": "Jane Austen",
        "published_year": 1811,
        "description": "Elinor and Marianne Dashwood navigate courtship, heartbreak, and fortune balancing rational sense and romantic sensibility.",
        "price": 11.00,
        "isbn": "978-0141439662",
        "cover": "https://covers.openlibrary.org/b/id/8237333-L.jpg"
    },
    {
        "title": "Emma",
        "author": "Jane Austen",
        "published_year": 1815,
        "description": "Handsome, clever, and rich Emma Woodhouse relishes matchmaking for her friends, blind to her own feelings until folly unfolds.",
        "price": 11.99,
        "isbn": "978-0141439587",
        "cover": "https://covers.openlibrary.org/b/id/8237444-L.jpg"
    },
    {
        "title": "Midnight's Children",
        "author": "Salman Rushdie",
        "published_year": 1981,
        "description": "Saleem Sinai is born at the midnight stroke of India's independence, his life telepathically linked to modern India's destiny.",
        "price": 16.99,
        "isbn": "978-0812976533",
        "cover": "https://covers.openlibrary.org/b/id/8237555-L.jpg"
    },
    {
        "title": "The Adventures of Huckleberry Finn",
        "author": "Mark Twain",
        "published_year": 1884,
        "description": "Huck Finn and runaway slave Jim drift down the Mississippi River, navigating moral hypocrisy, freedom, and profound companionship.",
        "price": 9.99,
        "isbn": "978-0143107323",
        "cover": "https://covers.openlibrary.org/b/id/8237666-L.jpg"
    },
    {
        "title": "Brave New World",
        "author": "Aldous Huxley",
        "published_year": 1932,
        "description": "A chilling prophetic dystopia of engineered harmony, conditioning, soma pills, and the tragic rebellion of the Savage.",
        "price": 14.99,
        "isbn": "978-0060850524",
        "cover": "https://covers.openlibrary.org/b/id/8237700-L.jpg"
    },
    {
        "title": "Les Misérables",
        "author": "Victor Hugo",
        "published_year": 1862,
        "description": "Jean Valjean's quest for redemption hunted relentlessly by Inspector Javert amidst the turbulence of the 1832 Paris uprising.",
        "price": 19.99,
        "isbn": "978-0451419439",
        "cover": "https://covers.openlibrary.org/b/id/8237777-L.jpg"
    },
    {
        "title": "Tess of the d'Urbervilles",
        "author": "Thomas Hardy",
        "published_year": 1891,
        "description": "Hardy's pastoral tragedy depicting the unjust suffering and steadfast dignity of pure woman Tess Durbeyfield.",
        "price": 12.50,
        "isbn": "978-0141439594",
        "cover": "https://covers.openlibrary.org/b/id/8237888-L.jpg"
    },
    {
        "title": "Dubliners",
        "author": "James Joyce",
        "published_year": 1914,
        "description": "Fifteen illuminating, piercing short stories depicting paralyzing epiphanies across everyday turn-of-the-century Dublin lives.",
        "price": 10.50,
        "isbn": "978-0140186475",
        "cover": "https://covers.openlibrary.org/b/id/8237999-L.jpg"
    },
    {
        "title": "The Scarlet Letter",
        "author": "Nathaniel Hawthorne",
        "published_year": 1850,
        "description": "In 17th-century Puritan Boston, Hester Prynne wears the scarlet letter 'A' of shame with quiet fortitude and transcendent grace.",
        "price": 9.99,
        "isbn": "978-0142437261",
        "cover": "https://covers.openlibrary.org/b/id/8238111-L.jpg"
    },
    {
        "title": "To the Lighthouse",
        "author": "Virginia Woolf",
        "published_year": 1927,
        "description": "A luminous modernist exploration of time, loss, memory, and artistic vision centered on the Ramsay family in the Hebrides.",
        "price": 13.99,
        "isbn": "978-0156907392",
        "cover": "https://covers.openlibrary.org/b/id/8238222-L.jpg"
    },
    {
        "title": "The Mill on the Floss",
        "author": "George Eliot",
        "published_year": 1860,
        "description": "The passionate, spirited Maggie Tulliver struggles between devotion to her stubborn brother Tom and her yearning for freedom.",
        "price": 13.50,
        "isbn": "978-0141439624",
        "cover": "https://covers.openlibrary.org/b/id/8238333-L.jpg"
    },
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "published_year": 1925,
        "description": "Jay Gatsby's dazzling, decadent parties on Long Island masking an elusive yearning for the green light and lost love Daisy Buchanan.",
        "price": 12.00,
        "isbn": "978-0743273565",
        "cover": "http://127.0.0.1:8000/uploads/the_great_gatsby.jpg"
    },
    {
        "title": "Finnegans Wake",
        "author": "James Joyce",
        "published_year": 1939,
        "description": "Joyce's monumental cyclically structured dreamscape written in polyglot puns and mythological echoes of universal slumber.",
        "price": 19.50,
        "isbn": "978-0141183114",
        "cover": "https://covers.openlibrary.org/b/id/8238444-L.jpg"
    },
    {
        "title": "Iliad (Penguin Clothbound)",
        "author": "Homer",
        "published_year": 2012,
        "description": "Fagles' benchmark poetic translation encased in a classic collector's embossed hardcover clothbound binding.",
        "price": 28.00,
        "isbn": "978-0141394657",
        "cover": "https://covers.openlibrary.org/b/id/8231856-L.jpg"
    },
    {
        "title": "The Castle",
        "author": "Franz Kafka",
        "published_year": 1926,
        "description": "Land surveyor K. arrives in an enigmatic snowbound village, struggling fruitlessly to gain access to the impenetrable castle authorities.",
        "price": 12.99,
        "isbn": "978-0805211061",
        "cover": "https://covers.openlibrary.org/b/id/8238555-L.jpg"
    },
    {
        "title": "The Road",
        "author": "Cormac McCarthy",
        "published_year": 2006,
        "description": "A father and young son walk alone through a burned, ash-covered post-apocalyptic America, carrying the fire of love and humanity.",
        "price": 14.99,
        "isbn": "978-0307387899",
        "cover": "https://covers.openlibrary.org/b/id/8238666-L.jpg"
    }
]

def seed():
    db = SessionLocal()
    existing_books = db.query(models.Book).all()
    existing_titles = {b.title.lower(): b for b in existing_books}
    print(f"Found {len(existing_books)} existing books in MySQL.")

    added_count = 0
    updated_count = 0

    for book_data in CLASSIC_BOOKS:
        title_lower = book_data["title"].lower()
        if title_lower in existing_titles:
            # Update missing attributes or price
            b = existing_titles[title_lower]
            b.author = book_data["author"]
            b.published_year = book_data["published_year"]
            b.description = book_data["description"]
            b.price = book_data["price"]
            b.isbn = book_data["isbn"]
            if not b.cover or "openlibrary" in b.cover:
                b.cover = book_data["cover"]
            updated_count += 1
        else:
            # Create new book record
            new_book = models.Book(
                id=str(uuid.uuid4()),
                title=book_data["title"],
                author=book_data["author"],
                isbn=book_data["isbn"],
                published_year=book_data["published_year"],
                description=book_data["description"],
                cover=book_data["cover"],
                price=book_data["price"]
            )
            db.add(new_book)
            added_count += 1

    db.commit()
    total = db.query(models.Book).count()
    print(f"Seeding complete! Added: {added_count}, Updated: {updated_count}. Total books in MySQL: {total}")
    db.close()

if __name__ == "__main__":
    seed()
