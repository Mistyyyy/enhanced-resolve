const path = require("path");
const fs = require("fs");
require("should");
const ResolverFactory = require("../lib/ResolverFactory");
const CachedInputFileSystem = require("../lib/CachedInputFileSystem");

const nodeFileSystem = new CachedInputFileSystem(fs, 4000);

const resolver = ResolverFactory.createResolver({
	enforceExtension: true,
	fileSystem: nodeFileSystem
});

const fixture = path.resolve(__dirname, "fixtures", "extensions");

describe("enforceExtension", function() {
	it("should throw an error because no extension be provided", function(done) {
		resolver.resolve({}, fixture, "./foo", {}, (err, result) => {
			err.should.be.an.Error;
			const message = err.message;
			message.should.startWith("Can't resolve './foo' in");
			done();
		});
	});
});
