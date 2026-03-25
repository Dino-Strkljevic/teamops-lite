package com.teamops.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private static final String CLAIM_USER_ID = "userId";

  private final JwtProperties jwtProperties;

  public JwtService(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
  }

  public String generateToken(UUID userId, String email) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + jwtProperties.getExpirationMs());

    return Jwts.builder()
        .subject(email)
        .claim(CLAIM_USER_ID, userId.toString())
        .issuedAt(now)
        .expiration(expiry)
        .signWith(signingKey())
        .compact();
  }

  public Claims extractAllClaims(String token) {
    return Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload();
  }

  public String extractEmail(String token) {
    return extractAllClaims(token).getSubject();
  }

  public UUID extractUserId(String token) {
    String raw = extractAllClaims(token).get(CLAIM_USER_ID, String.class);
    return UUID.fromString(raw);
  }

  public boolean isTokenValid(String token) {
    try {
      Claims claims = extractAllClaims(token);
      return claims.getExpiration().after(new Date());
    } catch (Exception e) {
      return false;
    }
  }

  private SecretKey signingKey() {
    byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
