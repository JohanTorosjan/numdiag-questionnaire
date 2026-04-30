alter table "session" add column "expiresAt" timestamptz not null;

alter table "session" add column "token" text not null unique;

alter table "session" add column "createdAt" timestamptz default CURRENT_TIMESTAMP not null;

alter table "session" add column "updatedAt" timestamptz not null;

alter table "session" add column "ipAddress" text;

alter table "session" add column "userAgent" text;

create index "session_userId_idx" on "session" ("userId");

alter table "session" add column "userId" text not null references "user" ("id") on delete cascade;

create table "user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" boolean not null, "image" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);

create table "account" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "user" ("id") on delete cascade, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" timestamptz, "refreshTokenExpiresAt" timestamptz, "scope" text, "password" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz not null);

create table "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" timestamptz not null, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);

create index "account_userId_idx" on "account" ("userId");

create index "verification_identifier_idx" on "verification" ("identifier");