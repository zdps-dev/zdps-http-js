import { strictEqual } from 'assert';
import { makeHttpGet, makeHttpPost , getCaptures} from './zdps-http.mjs';

async function get_and_assert_captures() {
    const captures = [
        ["$.statusCode", "status"],
        ["$.dataJson.abilities[0].ability.name", "ability_name"],
    ];
    const asserts = [
        ["status", 200],
        ["ability_name", "run-away"],
    ];
    const req = makeHttpGet("https://pokeapi.co/api/v2/pokemon/rattata");
    const resp = await req;

    let captured = getCaptures(resp, captures);

    for (const [namekey, expect] of asserts) {
        strictEqual(captured[namekey], expect);
    }
}

async function post_and_log() {
    const req = makeHttpPost("https://httpbin.org/post", {x: 1});
    const resp = await req;
    console.log(resp)
}

get_and_assert_captures();
post_and_log();