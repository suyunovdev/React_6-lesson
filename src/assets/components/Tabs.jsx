<Tabs
  id="contact-tabs"
  activeKey={key}
  onSelect={(k) => setKey(k)}
  className="mt-4 bg-gray-100 rounded-lg overflow-hidden"
>
  <Tab eventKey="all" title="All Contacts" className="bg-white rounded-t-lg">
    {/* ... */}
  </Tab>
  <Tab eventKey="favorites" title="Favorite Contacts" className="bg-white rounded-t-lg">
    {/* ... */}
  </Tab>
</Tabs>
