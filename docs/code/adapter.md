<a name="PromiseAdapter"></a>
## PromiseAdapter
**Summary**: Adapter for the primary promise operations.  

---
Provides compatibility with promise libraries that are not <a href="https://promisesaplus.com">Promises/A+</a> compliant,

### Parameters
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>create</td><td><code>function</code></td><td><p>A function that takes a callback parameter and returns a new promise object.
The callback parameter is expected to be <code>function(resolve, reject)</code>.</p>
<p>Passing in anything other than a function will throw <code>Adapter requires a function to create a promise.</code></p>
</td>
    </tr><tr>
    <td>resolve</td><td><code>function</code></td><td><p>A function that takes an optional data parameter and resolves a promise with it.</p>
<p>Passing in anything other than a function will throw <code>Adapter requires a function to resolve a promise.</code></p>
</td>
    </tr><tr>
    <td>reject</td><td><code>function</code></td><td><p>A function that takes an optional error parameter and rejects a promise with it.</p>
<p>Passing in anything other than a function will throw <code>Adapter requires a function to reject a promise.</code></p>
</td>
    </tr>  </tbody>
</table>

**See**: <a href="module.md">module</a>, <a href="https://github.com/vitaly-t/spex/blob/master/docs/client.md">client-side</a>  