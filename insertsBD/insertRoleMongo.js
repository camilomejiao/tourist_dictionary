const bulk = db.roles.initializeUnorderedBulkOp();
bulk.insert({"_id": ObjectId("64a44666f0c34748cbf6c713"),"role_name": "ADMIN","description": "ADMIN","active": true});
bulk.insert({"_id": ObjectId("64a44760e19594a578ef2600"),"role_name": "CUSTOMER","description": "CUSTOMER","active": true});
bulk.execute();