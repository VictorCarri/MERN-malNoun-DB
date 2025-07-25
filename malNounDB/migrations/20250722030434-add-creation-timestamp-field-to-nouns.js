module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
	const nounColl = db.collection("noun");
	nounColl.updateMany({}, {
			$set: {
				createdAt: new Date(),
				updatedAt: new Date()
			}
		},
		{
			upsert: true
		}
	);
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
	nounColl.updateMany({}, {
			$unset: {
				createdAt: new Date(),
				updatedAt: new Date()
			}
		},
		{
			upsert: true
		}
	);
  },
};
