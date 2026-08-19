// CloudFront Function (viewer-response) — adds security response headers.
// S3 static website hosting doesn't let you set these, so they have to be
// injected at the CDN edge instead.
//
// No CSP here on purpose: this is a single-author static site with no user
// input, no CMS, and no server-rendered untrusted data, so there's no
// injection vector for a CSP to defend against — and script-src would need
// 'unsafe-inline' anyway for the dark-mode FOUC-prevention script in
// baseof.html, which defeats most of its point. The Font Awesome <script>
// tags already carry Subresource Integrity hashes, which is the actual
// defense against that CDN being compromised. These headers instead cover
// things that don't depend on trusting your own content: framing,
// MIME-sniffing, referrer leakage, and unused browser APIs.
//
// Published as the CloudFront Function "blog-security-headers" (LIVE stage)
// and associated with distribution E2BXX0VHQEULW0's default cache behavior,
// viewer-response event. This repo has no Terraform/CDK tracking the
// distribution, so that association was made by hand via the CLI, not by
// the deploy workflow — if this file changes, the function needs a manual
// update + re-publish to take effect:
//   aws cloudfront update-function --name blog-security-headers \
//     --function-config Comment="security response headers",Runtime=cloudfront-js-2.0 \
//     --function-code fileb://.github/cloudfront-security-headers.js \
//     --if-match <ETag from `aws cloudfront describe-function --name blog-security-headers`>
//   aws cloudfront publish-function --name blog-security-headers --if-match <ETag from the update above>

function handler(event) {
    var response = event.response;
    var headers = response.headers;

    headers['strict-transport-security'] = { value: 'max-age=63072000; includeSubDomains; preload' };
    headers['x-content-type-options'] = { value: 'nosniff' };
    headers['x-frame-options'] = { value: 'DENY' };
    headers['referrer-policy'] = { value: 'strict-origin-when-cross-origin' };
    headers['permissions-policy'] = { value: 'geolocation=(), camera=(), microphone=(), payment=(), usb=()' };

    return response;
}
