
Update `supabase/config.toml` to add a `[functions.post-to-x]` block with `verify_jwt = false`, allowing the function to be invoked from database triggers without JWT authentication.

### Change to `supabase/config.toml`

Append:
```toml
[functions.post-to-x]
verify_jwt = false
```

No other files affected. The existing `post-to-x` function code is not modified.
