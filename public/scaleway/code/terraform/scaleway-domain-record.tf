resource "scaleway_domain_record" "www" {
  dns_zone = "domain.tld"
  name     = "dns-${local.naming_suffix}"
  type     = "A"
  data     = "1.2.3.4"
  ttl      = 3600
}

resource "scaleway_domain_record" "www2" {
  dns_zone = "domain.tld"
  name     = "dns-${local.naming_suffix}"
  type     = "A"
  data     = "1.2.3.5"
  ttl      = 3600
}

resource "scaleway_domain_record" "mx" {
  dns_zone = "domain.tld"
  name     = "dns-${local.naming_suffix}"
  type     = "MX"
  data     = "mx.online.net."
  ttl      = 3600
  priority = 10
}

resource "scaleway_domain_record" "mx2" {
  dns_zone = "domain.tld"
  name     = "dns-${local.naming_suffix}"
  type     = "MX"
  data     = "mx-cache.online.net."
  ttl      = 3600
  priority = 20
}