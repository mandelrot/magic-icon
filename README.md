# Magic Icon

An UX boost to add to your app: a minimal desktop floating icon (replace it with your own) usable as a launcher 
and as a fully customizable non-invasive notifications system.

<div align="center">
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMgRVnOQEL5iX9ZkH67M_VDVuv4t3ZnMYpJ-oyV_g8a6L8Tue6U_UrJNpfTLlmWDjVWWTBG_-4UMljyDWcr2X-2aX8FE14pIxTZvmeaSzUWD2CGcXDEkhr_XYV6aPqI8ovGhaLgab5yssKlTOITn4QK6x5bQ6sgPEBAuZCwKlJdtCgTpY1gb9jJmru/s1600/mi-description.gif" width="90%"/>
</div>
<br>

Tested on Windows and Linux. If you want to try it out here you can download a compiled (Windows) version: 


[https://mega.nz/file/nWQ0FDBD#bHrKVh9bVbsjPvBYBzha8INl1ddbK4dtJEEiEVuGWoM](https://mega.nz/file/nWQ0FDBD#bHrKVh9bVbsjPvBYBzha8INl1ddbK4dtJEEiEVuGWoM)

<br>

## Main features

- 100% html/css/js, meaning 100% customizable in appearance and behavior (icons, menu, notifications style...).
- Notifications launched from Electron main process (backend server events can trigger them as push notifications).
- Multi-screen support.
- State management: the icon remembers its last position when restarted.
- Off-bounds control: the icon nevers gets lost, is relocated when steps out of the screen limits.

<div align="center">
<img src="https://blogger.googleusercontent.com/img/a/AVvXsEiARbTEWpI2MUyZcGzzOXE1JDXXdo1CZygfjodwejIRLYovKBzM7dxyA6mIrM1e-zXew40ormDLlVHwDeqzj5QdLTm354gK2Z0t7R7tKujrMeJkvu11HIpVZibFuIADD4LtQNGexxcWnRgoWX9Lqad8fbQS-jPsTMRgtWFo0rcU_8pxSTDr0gZbWRo9" width="80%">
</div>

- Context menu automatic relocation to fit into screen boundaries.

<div align="center">
<img src="https://blogger.googleusercontent.com/img/a/AVvXsEhrXTj-loGgghH5rszr7PyCCv64ppf93duJLjyx_0DCEaA1NPoMB7f6qLWmvv7GKk9ZpXQN2IUQPAWSjnecolWzQymtTG6gxLduXKVWB4pAJfZYr_SXfVS3bBGYoQ4Ta3dbApZoHTkuNXrAe8V9I8Sy7K6z47fv-WkPdGAZeNNztcHi7XlKadQzRw_X" width="80%">
</div>

- Icon invisible in taksbar or tray: only your open apps will use a slot.

<div align="center">
<img src="https://blogger.googleusercontent.com/img/a/AVvXsEjKOZvNFWgmLgecsMhAqY9jiQbMy73xSX-LdfkzO5quEEXPJ1l7zkgpVowCP6hJOLxnLEBXpdOzQwnuvLBfqyqoPqJ1iel9duImvBTX-GpYvdfnvKeP55wi7zsi1Jsw2ofzw08w-a8X9KenZaW16QBf9GnH7dI5hUbiJONOwKY87el9hbUMVvExzgG2" width="80%">
</div>

- Desktop or web apps available: you can launch Electron desktop windows or webpages in your browser.
<br>

## Extended features

- One login, many sessions: do your users need to identify themselves in different apps? You can enable one login for all of them (with an in-app window for this purpose),
store the data in the magic icon module, and managing the identification process internally before opening the destination address so they won't need to fill in the login 
form again and again. Using a one-time-token and passing it to external urls you can do this with browser webpages as well.

<br>

## Author

For further info or contact please visit my profesional webpage or my blog: 

[http://josealeman.info](http://josealeman.info)

[https://mandelrot.com](https://mandelrot.com)
