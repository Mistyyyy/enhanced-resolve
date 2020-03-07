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
	it("should not resolve ro file when ext of file is missing", function(done) {
		resolver.resolve({}, fixture, "./foo", {}, (err, result) => {
			err.should.be.instanceof(Error);
			done();
		});
	});
});
